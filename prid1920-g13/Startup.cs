﻿using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using prid_1819_g13.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace prid_1819_g13
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<Context>(opt =>
            {
                opt.UseLazyLoadingProxies();
                opt.UseSqlServer(Configuration.GetConnectionString("gamer-paradise"));
                //opt.UseMySql(Configuration.GetConnectionString("prid-1920-g13-mysql"));
            });
            services.AddRazorPages();   
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
            services.AddSignalR();
            //------------------------------
            // configure jwt authentication
            //------------------------------
            // Notre clé secrète pour les jetons sur le back-end
            var key = Encoding.ASCII.GetBytes("my-super-secret-key");
            // On précise qu'on veut travaille avec JWT tant pour l'authentification 
            // que pour la vérification de l'authentification
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(x =>
                {
                    // On exige des requêtes sécurisées avec HTTPS
                    x.RequireHttpsMetadata = true;
                    x.SaveToken = true;
                    // On précise comment un jeton reçu doit être validé
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        // On vérifie qu'il a bien été signé avec la clé définie ci-dessous
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        // On ne vérifie pas l'identité de l'émetteur du jeton
                        ValidateIssuer = false,
                        // On ne vérifie pas non plus l'identité du destinataire du jeton
                        ValidateAudience = false,
                        // Par contre, on vérifie la validité temporelle du jeton
                        ValidateLifetime = true,
                        // On précise qu'on n'applique aucune tolérance de validité temporelle
                        ClockSkew = TimeSpan.Zero  //the default for this setting is 5 minutes
                    };
                    // On peut définir des événements liés à l'utilisation des jetons
                    x.Events = new JwtBearerEvents
                    {
                        // Si l'authentification du jeton est rejetée ...
                        OnAuthenticationFailed = context =>
                                {
                                    // ... parce que le jeton est expiré ...
                                    if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                                    {
                                        // ... on ajoute un header à destination du front-end indiquant cette expiration
                                        context.Response.Headers.Add("Token-Expired", "true");
                                    }
                                    return Task.CompletedTask;
                                }
                    };
                    
                });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for 
                // production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseDefaultFiles();
            app.UseStaticFiles();
            // app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                name: "Default",
                pattern: "{controller=default}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
                endpoints.MapHub<NotificationsHub>("/notificationsHub");
            });
            app.UseSpaStaticFiles();
            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501
                spa.Options.SourcePath = "ClientApp";
                if (env.IsDevelopment())
                {
                    // Utilisez cette ligne si vous voulez que VS lance le front-end angular quand vous démarrez l'app
                    //spa.UseAngularCliServer(npmScript: "start");
                    // Utilisez cette ligne si le front-end angular est exécuté en dehors de VS (ou dans une autre instance de VS)
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
        }
    }
}

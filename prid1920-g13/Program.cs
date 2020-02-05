using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Neo4jClient;
using Newtonsoft.Json.Serialization;
using prid_1819_g13.Models;

namespace prid_1819_g13
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Neo4JConnection();
            // CreateWebHostBuilder(args).Build().Seed().Run();
        }
        public static async Task Neo4JConnection()
        {
            Console.WriteLine("Connecting to Neo4J");
            var client = new GraphClient(new Uri("http://localhost:7474/db/data/"), "neo4j", "123")
            {
                JsonContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            var neo4Jconnection = client.ConnectAsync();
            await neo4Jconnection;
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}

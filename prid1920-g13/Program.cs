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
            var test = Neo4JConnection();
            test.Wait();
            Console.WriteLine(test.Result.FirstOrDefault());
            // CreateWebHostBuilder(args).Build().Seed().Run();
        }
        public static async Task<IEnumerable<string>> Neo4JConnection()
        {
            Console.WriteLine("Connecting to Neo4J");
            var client = new GraphClient(new Uri("http://localhost:11003/db/data/"), "neo4j", "123")
            {
                JsonContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            Console.WriteLine(client.IsConnected);
            await client.ConnectAsync();
            return await client.Cypher
                .Match("(f:Film)")
                .Where("f.name = \"Deadpool 2\" ")
                .Return<string>("f").ResultsAsync;
            
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}

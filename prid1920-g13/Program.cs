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
            CreateWebHostBuilder(args).Build().Seed().Run();
        }
        public static async void CreateNeo4JData()
        {
            Console.WriteLine("Connecting to Neo4J...");
            var client = new GraphClient(new Uri("http://localhost:7474/db/data/"), "neo4j", "123")
            {
                JsonContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            await client.ConnectAsync();

            client.Cypher.Merge("(u:User {firstName: \"Benoît\", lastName: \"Penelle\",id: 1,pseudo: \"ben\"})")
            .Merge("(u0:User {firstName: \"Bruno\", lastName: \"Lacroix\",id: 2,pseudo: \"bruno\"})")
            .Merge("(u1:User {firstName: \"Administrator\", lastName: \"Administrator\",id: 3,pseudo: \"admin\"})")
            .Merge("(u2:User {firstName: \"Boris\", lastName: \"Verhaegen\",id: 4,pseudo: \"boris\"})")
            .Merge("(u3:User {firstName: \"Alain\", lastName: \"Silovy\",id: 5,pseudo: \"alain\"})")
            .Merge("(u4:User {firstName: \"Nicolas\", lastName: \"Godfrin\",id: 6,pseudo: \"Darknico\"})")
            .Merge("(u5:User {id: 8,pseudo: \"test\"})")
            .Merge("(g:Game {image: \"https://www.giantbomb.com/api/image/scale_medium/2849278-box_wowtbc.png\",expected_release_day: 16,deck: \"Travel to Outland in the first expansion to the immensely popular World of Warcraft. The Burning Crusade brings new races, instances, areas and experiences to the table.\",name: \"World of Warcraft: The Burning Crusade\",expected_release_year: 2007,id: 18603,platforms: \"PC,MAC\",expected_release_month: 1})")
            .Merge("(g0:Game {image: \"https://www.giantbomb.com/api/image/scale_medium/2849275-box_wow.png\",expected_release_day: 23,deck: \"World of Warcraft is an MMORPG that takes place in Blizzard Entertainment's Warcraft universe. At its peak, it boasted a player base of over 12.5 million subscribers, making it the most popular MMO of all time\",name: \"World of Warcraft\",expected_release_year: 2004,id: 19783,expected_release_month: 11,platforms: \"PC,MAC\"})")
            .Merge("(g1:Game {image: \"https://www.giantbomb.com/api/image/scale_medium/2849280-box_wowwotlk.png\",expected_release_day: 13,deck: \"Travel to the arctic continent of Northrend in Blizzard's second expansion to the most popular MMORPG ever made.\",name: \"World of Warcraft: Wrath of the Lich King\",expected_release_year: 2008,id: 20701,platforms: \"PC,MAC\",expected_release_month: 11})")
            .Merge("(g3:Game {id : 27896, deck : \"Cataclysm is the third expansion pack to World of Warcraft. This expansion revamped and changed much of the original world content in addition to providing new areas, dungeons, and playable races.\",name : \"World of Warcraft: Cataclysm\",expected_release_year : 2010,expected_release_month : 12,expected_release_day : 7, platforms : \"PC,MAC\",image : \"https://www.giantbomb.com/api/image/scale_medium/2849276-box_wowc.png\"})")
            .Merge("(g4:Game {id : 36734, deck : \"Unveiled at Blizzcon 2011, Mists of Pandaria is the fourth expansion for World of Warcraft. The game focuses on the war between the Horde and Alliance, and not a main villain like the previous expansions. Players embark on a journey to Pandaria, discovering a new race, class and much more.\",name : \"World of Warcraft: Mists of Pandaria\",expected_release_year : 2012,expected_release_month : 9,expected_release_day : 25, platforms : \"PC,MAC\",image: \"https://www.giantbomb.com/api/image/scale_medium/2849277-box_wowmop.png\"})")
            .Merge("(g5:Game {id : 44468, deck : \"Allowing players to enter the past and tread the world of Draenor before its destruction, the fifth World of Warcraft expansion brings a level cap increase to level 100, a new world, and another graphics engine overhaul.\",name : \"World of Warcraft: Warlords of Draenor\",expected_release_year : 2014,expected_release_month : 11,expected_release_day : 13, platforms :\"PC,MAC\",image : \"https://www.giantbomb.com/api/image/scale_medium/2849279-box_wowwod.png\"})")
            .Merge("(g6:Game {id : 50520, deck : \"The sixth World of Warcraft expansion taking place on the Broken Isles with a new Demon Hunter hero class and a level 110 level cap.\",name : \"World of Warcraft: Legion\",expected_release_year : 2016,expected_release_month : 8,expected_release_day : 30, platforms : \"PC,MAC\",image : \"https://www.giantbomb.com/api/image/scale_medium/2881096-box_wowl.png\"})")
            .Merge("(g7:Game {id : 64475, deck : \"The seventh expansion for World of Warcraft features new zones, Allied Races for both factions and a raised level cap to 120.\",name : \"World of Warcraft: Battle for Azeroth\",expected_release_year : 2018,expected_release_month : 8,expected_release_day : 14, platforms : \"PC,MAC\",image : \"https://www.giantbomb.com/api/image/scale_medium/3015277-6219515987-world.jpg\"})")
            .Merge("(g8:Game {id : 75882, deck : \"The eighth World of Warcraft expansion set, Shadowlands opens up the world of the afterlife, due to Sylvanas Windrunner defeating the Lich King.\",name : \"World of Warcraft: Shadowlands\",expected_release_year : 2020,expected_release_month : 1,expected_release_day : 1, platforms : \"PC,MAC\"})")
            .Merge("(u4)-[:Play]->(g8)")
            .Merge("(u4)-[:Play]->(g7)")
            .Merge("(u4)-[:Play]->(g5)")
            .Merge("(u2)-[:Play]->(g3)")
            .Merge("(u1)-[:Play]->(g4)")
            .ExecuteWithoutResultsAsync()
            .Wait();

        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}

using Newtonsoft.Json;

namespace prid_1819_g13.Models
{
    public class GameNeo4J
    {
        [JsonProperty(PropertyName = "id")]
        public int Id { get; set; }
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
        [JsonProperty(PropertyName = "deck")]
        public string Deck { get; set; }
        [JsonProperty(PropertyName = "expected_release_day")]
        public int Expected_release_day {get;set;}
        [JsonProperty(PropertyName = "expected_release_month")]
        public int Expected_release_month {get;set;}
        [JsonProperty(PropertyName = "expected_release_year")]
        public int Expected_release_year {get;set;}
        [JsonProperty(PropertyName = "image")]
        public string Image { get; set; }
    }


}
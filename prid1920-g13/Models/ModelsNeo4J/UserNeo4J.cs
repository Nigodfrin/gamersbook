using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace prid_1819_g13
{
    public class UserNeo4J
    {
        [JsonProperty(PropertyName = "id")]
        public int Id { get; set; }
        [JsonProperty(PropertyName = "pseudo")]
        [StringLength(10, MinimumLength = 3, ErrorMessage = "Pseudo Should be minimum 3 characters and a maximum of 10 characters")]
        [Required(ErrorMessage = "Required")]
        [RegularExpression("^[a-zA-Z][a-zA-Z0-9_]*", ErrorMessage = "Pseudo can contain only letters, numbers or underscore")]
        public string Pseudo { get; set; }
        [JsonProperty(PropertyName = "firstName")]
        public string FirstName {get;set;}
        [JsonProperty(PropertyName = "lastName")]
        public string LastName {get;set;}
    }
}
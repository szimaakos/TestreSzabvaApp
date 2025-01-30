using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TestreSzabva.Models
{
    public class Felhasznalo : IdentityUser
    {
        public float? Weight { get; set; }
        public float? Height { get; set; }
        public int? Age { get; set; }
        public string? Gender { get; set; }
        public string? ActivityLevel { get; set; }
        public float? GoalWeight { get; set; }

        public bool IsProfileComplete { get; set; } = false;

        // Navigációs tulajdonság
        public ICollection<HetiEtrend> HetiEtrendek { get; set; } = new List<HetiEtrend>();
    }
}

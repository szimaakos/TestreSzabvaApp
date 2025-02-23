﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using TestreSzabva.Models;

public class HetiEtrend
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int PlanId { get; set; }

    [Required]
    public string UserId { get; set; }

    [JsonIgnore]
    public Felhasznalo Felhasznalo { get; set; }

    [Required]
    public string DayOfWeek { get; set; }

    [Required]
    public string MealTime { get; set; }

    [Required]
    public int FoodId { get; set; }

    [JsonIgnore]
    public Etel Etel { get; set; }

    [Required]
    [Range(1, 500)]
    public float Quantity { get; set; }

    [Required]
    public float TotalCalories { get; set; }
}

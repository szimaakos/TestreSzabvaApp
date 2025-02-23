using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using TestreSzabva.Models;

public class MealFood
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int FoodId { get; set; }

    [ForeignKey("FoodId")]
    public Etel Etel { get; set; }

    [Required]
    [Range(1, 500)]
    public float Quantity { get; set; }

    [Required]
    public float TotalCalories { get; set; }

    [Required]
    public int MealSlotId { get; set; }

    [ForeignKey("MealSlotId")]
    public HetiEtrend MealSlot { get; set; }
}

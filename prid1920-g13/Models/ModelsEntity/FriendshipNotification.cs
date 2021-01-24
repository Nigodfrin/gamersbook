using prid_1819_g13;
using prid_1819_g13.Models;

public class FriendshipNotification
{
    public int NotificationId { get; set; }
    public Notification Notification { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
}
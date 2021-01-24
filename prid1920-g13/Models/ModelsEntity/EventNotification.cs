using prid_1819_g13;
using prid_1819_g13.Models;

public class EventNotification
{
    public int NotificationId { get; set; }
    public Notification Notification { get; set; }
    public int EventId { get; set; }
    public Event Event { get; set; }
}

from users.models import User

def get_available_crew():
    return (
        User.objects
        .filter(group="DELIVERY_CREW")
        .exclude(delivery_orders__status="OUT_FOR_DELIVERY")
        .first()
    )
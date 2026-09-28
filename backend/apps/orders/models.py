import uuid
from django.db import models
from django.conf import settings
from apps.stores.models import Store, Product

class ParentOrder(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PAYMENT_PENDING = 'PAYMENT_PENDING', 'Payment Pending'
        PAID = 'PAID', 'Paid'
        SELLER_CONFIRMED = 'SELLER_CONFIRMED', 'Seller Confirmed'
        PREPARING = 'PREPARING', 'Preparing'
        READY_FOR_PICKUP = 'READY_FOR_PICKUP', 'Ready for Pickup'
        RIDER_ASSIGNED = 'RIDER_ASSIGNED', 'Rider Assigned'
        PICKED_UP = 'PICKED_UP', 'Picked Up'
        OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', 'Out for Delivery'
        DELIVERED = 'DELIVERED', 'Delivered'
        CANCELLED = 'CANCELLED', 'Cancelled'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=50, unique=True)
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    customer_name = models.CharField(max_length=150)
    customer_phone = models.CharField(max_length=20)
    delivery_address = models.TextField()
    delivery_area = models.CharField(max_length=100)
    notes = models.TextField(blank=True, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    items_subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING)
    mpesa_receipt_number = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class SellerOrder(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PAID = 'PAID', 'Paid'
        PREPARING = 'PREPARING', 'Preparing'
        READY_FOR_PICKUP = 'READY_FOR_PICKUP', 'Ready for Pickup'
        PICKED_UP = 'PICKED_UP', 'Picked Up'
        DELIVERED = 'DELIVERED', 'Delivered'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent_order = models.ForeignKey(ParentOrder, on_delete=models.CASCADE, related_name='seller_orders')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_share = models.DecimalField(max_digits=10, decimal_places=2)
    commission = models.DecimalField(max_digits=10, decimal_places=2) # 10%
    seller_net_earnings = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seller_order = models.ForeignKey(SellerOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

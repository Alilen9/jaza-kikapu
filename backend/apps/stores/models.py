import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        BUYER = 'BUYER', 'Buyer'
        SELLER = 'SELLER', 'Seller'
        RIDER = 'RIDER', 'Rider'
        BUSINESS_ADMIN = 'BUSINESS_ADMIN', 'Business Admin'
        ADMIN = 'ADMIN', 'Admin'
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=20, unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.BUYER)
    is_phone_verified = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

class Location(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    county = models.CharField(max_length=100, default='Taita-Taveta')
    sub_county = models.CharField(max_length=100) # Voi, Taveta, Wundanyi, Mwatate
    town = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    market_name = models.CharField(max_length=150)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)

    def __str__(self):
        return f"{self.market_name} - {self.town}, {self.county}"

class Store(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Approval'
        VERIFIED = 'VERIFIED', 'Verified'
        ACTIVE = 'ACTIVE', 'Active'
        SUSPENDED = 'SUSPENDED', 'Suspended'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stores')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    category = models.CharField(max_length=100)
    description = models.TextField()
    cover_image = models.ImageField(upload_to='stores/covers/')
    logo = models.ImageField(upload_to='stores/logos/')
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True)
    stall_number = models.CharField(max_length=50)
    is_open = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    jaza_score = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    orders_completed = models.PositiveIntegerField(default=0)
    response_rate = models.PositiveIntegerField(default=95)
    followers_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=1)
    unit = models.CharField(max_length=50, default='piece')
    image = models.ImageField(upload_to='products/')
    is_available = models.BooleanField(default=True)
    is_taita_local = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.store.name})"

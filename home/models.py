from django.db import models
from django.contrib.auth.models import User, AbstractUser

class Customer(models.Model):
    owner = models.ManyToManyField('home.Vendor',related_name='customers')
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=60)
    position = models.CharField(max_length=60)
    def __unicode__(self):
        return self.name

class Vendor(AbstractUser):
    vendor_id = models.CharField(max_length=8)
    name = models.CharField(max_length=40)
    citizenship_card = models.DecimalField(max_digits=11,decimal_places=0,null=True)
    commission = models.DecimalField(max_digits=3,decimal_places=2,null=True)

class Task(models.Model):
    owner = models.ForeignKey('home.Vendor',related_name='tasks')
    text = models.CharField(max_length=140,blank=True)
    createdAt = models.DateTimeField()
    taskType = models.CharField(max_length=11)
    begin = models.DateTimeField()
    end = models.DateTimeField(null=True,blank=True)
    amount = models.DecimalField(max_digits=11,decimal_places=2,\
            null=True,blank=True)
    didPay = models.BooleanField()
    orderNumber = models.CharField(max_length=20,blank=True)
    customer = models.ForeignKey(Customer)
    def __unicode__(self):
        return self.owner.username + "-" + self.customer.name


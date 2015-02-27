from django.db import models
from django.contrib.auth.models import User, AbstractUser

class Customer(models.Model):
    owner = models.ManyToManyField('home.Vendor',related_name='customers')
    name = models.CharField(max_length=40)
    contact = models.CharField(max_length=40)
    position = models.CharField(max_length=40)
    def __unicode__(self):
        return self.name

class Vendor(AbstractUser):
    vendor_id = models.CharField(max_length=8)
    name = models.CharField(max_length=40)
    citizenship_card = models.DecimalField(max_digits=11,decimal_places=0,null=True)
    commission = models.DecimalField(max_digits=3,decimal_places=2,null=True)

class Task(models.Model):
    owner = models.ForeignKey('home.Vendor',related_name='tasks')
    text = models.CharField(max_length=140)
    createAt = models.DateTimeField()
    taskType = models.CharField(max_length=11)
    when = models.DateTimeField()
    appoint = models.DateTimeField()
    serialNumber = models.CharField(max_length=30)
    partNumber = models.CharField(max_length=30)
    quantity = models.DecimalField(max_digits=3,decimal_places=0)
    customer = models.OneToOneField(Customer)
    def __unicode__(self):
        return self.owner.username + "-" + self.customer.name


from django.db import models
from django.contrib.auth.models import User

class Customer(models.Model):
    owner = models.ManyToManyField('auth.User',related_name='customers')
    customer_id = models.DecimalField(max_digits=8,decimal_places=0)
    name = models.CharField(max_length=40)
    contact = models.CharField(max_length=40)
    position = models.CharField(max_length=40)
    def __unicode__(self):
        return self.name

class Employee(models.Model):
    user = models.OneToOneField(User)
    employee_id = models.CharField(max_length=8)
    name = models.CharField(max_length=40)
    citizenship_card = models.DecimalField(max_digits=11,decimal_places=0,null=True)
    commission = models.DecimalField(max_digits=3,decimal_places=2,null=True)
    customers = models.ManyToManyField(Customer,null=True)
    def __unicode__(self):
        return self.user.username

class Task(models.Model):
    owner = models.ForeignKey('auth.User',related_name='tasks')
    text = models.CharField(max_length=140)
    createAt = models.DateTimeField()
    isCService = models.BooleanField()
    isShipping = models.BooleanField()
    when = models.DateTimeField()
    appoint = models.DateTimeField()
    itemNum = models.CharField(max_length=30)
    quantity = models.DecimalField(max_digits=3,decimal_places=0)
    customer = models.OneToOneField(Customer)


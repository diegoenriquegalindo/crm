from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from home.models import Employee, Customer, Task

class EmployeeInline(admin.StackedInline):
    model = Employee
    can_delete = False
    verbose_name_plural = 'employee'

# Define a new User admin
class UserAdmin(UserAdmin):
    inlines = (EmployeeInline, )

# register your models here.
admin.site.register(Customer)
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Task)

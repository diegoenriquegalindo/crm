import pickle
from django.contrib.auth.models import User
from home.models import Employee, Customer
from sets import Set

def get_username(first_name):
    first_name = first_name.lower()
    username = first_name
    user_num = 1
    while username in username_set:
        username = first_name + str(user_num)
        user_num += 1
    username_set.add(username)
    return username

def add_employee(employee):
    first_name = employee[1].split()[0]
    username = get_username(first_name)
    new_user = User.objects.create_user(username,'','piggy')
    new_employee = Employee()
    new_employee.user = new_user
    new_employee.employee_id = employee[0]
    new_employee.name = employee[1]
    citizenship_card = employee[2]
    try: citizenship_card = int(citizenship_card)
    except ValueError: citizenship_card = None
    new_employee.citizenship_card = citizenship_card
    commission = employee[3]
    try: commission = float(commission)
    except ValueError: commission = None
    new_employee.commission = commission
    new_employee.save()

def add_customer(customer):
    new_customer = Customer()
    new_customer.customer_id = int(customer[0])
    new_customer.name = customer[1]
    new_customer.contact = customer[4]
    new_customer.position = customer[5]
    new_customer.save()

f = open("vendedores.pkl")
employees = pickle.load(f)
username_set = Set()
for employee in employees[1]:
    if employee[0] == 'ND': continue
    add_employee(employee)

f.close()

f = open("listaClientes00.pkl")
customers = pickle.load(f)
print len(customers[1])
for customer in customers[1]:
    add_customer(customer)

f.close()

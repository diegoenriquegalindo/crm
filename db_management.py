import pickle
from home.models import Vendor, Customer
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

def add_vendor(vendor):
    first_name = vendor[1].split()[0]
    username = get_username(first_name)
    new_vendor = Vendor.objects.create_user(username,'','piggy')
    new_vendor.vendor_id = vendor[0]
    new_vendor.name = vendor[1]
    citizenship_card = vendor[2]
    try: citizenship_card = int(citizenship_card)
    except ValueError: citizenship_card = None
    new_vendor.citizenship_card = citizenship_card
    commission = vendor[3]
    try: commission = float(commission)
    except ValueError: commission = None
    new_vendor.commission = commission
    new_vendor.save()

def add_customer(customer):
    new_customer = Customer()
    new_customer.customer_id = int(customer[0])
    new_customer.name = customer[1]
    new_customer.contact = customer[4]
    new_customer.position = customer[5]
    new_customer.save()
    # new_customer.owner = User.objects.filter(username='pagalin')
    # new_customer.save()

def join_customer_vendor():
    pass

f = open("vendedores.pkl")
vendors = pickle.load(f)
username_set = Set()
for vendor in vendors[1]:
    if vendor[0] == 'ND': continue
    add_vendor(vendor)

f.close()

f = open("listaClientes00.pkl")
customers = pickle.load(f)
for customer in customers[1]:
    add_customer(customer)

f.close()

# f = open("listaClientes00.pkl")
# customers = pickle.load(f)
# add_customer(customers[1][0])

# f.close()


class Dataset:
    def __init__(self):
        # id of dataset type
        self.dataset_type_id = None

        # ids of parameters values - array
        self.parameter_value_ids = None

        # year
        self.year = None

        # actual dataset - dictionary district_id:value
        self.data = None


    #TODO:
    def insert(self):
        specific_dataset_id = self.__insert_specific_dataset(self.year)

        sql = "INSERT INTO `values` (value, district_id, specific_dataset_id) VALUES (%s, %s, %s)"
        val = []
        for district_id in self.data.keys():
            val.append((self.data[district_id], district_id, specific_dataset_id))

        mycursor.executemany(sql, val)
        mydb.commit()

        self.__insert_belongs(specific_dataset_id)

        return mycursor.lastrowid

    def __insert_belongs(self, specific_dataset_id):
        sql = "INSERT INTO belongs (specific_dataset_id, parameter_value_id) VALUES (%s, %s)"
        val = []

        for parameter in self.parameter_value_ids:
            val.append((specific_dataset_id, parameter))

        mycursor.executemany(sql, val)

        mydb.commit()

    def __insert_specific_dataset(self, year):
        sql = "INSERT INTO specific_year_datasets (year) VALUES (%s)"
        val = (year,)
        mycursor.execute(sql, val)

        mydb.commit()

        return mycursor.lastrowid

    # insert dataset type, returns id
    def __insert_dataset_type(self, name):
        sql = "INSERT INTO dataset_types (name) VALUES (%s)"
        val = (name,)
        mycursor.execute(sql, val)

        mydb.commit()

        return mycursor.lastrowid

    # get dataset type id from name, if it does not exist insert it and return id
    def get_dataset_type_id(self, name):
        sql = "SELECT * FROM dataset_types WHERE name = %s"
        adr = (name, )

        mycursor.execute(sql, adr)
        myresult = mycursor.fetchall()

        if mycursor.rowcount == 0:
            return self.__insert_dataset_type(name)

        return myresult[0][0]

    # insert parameter, returns id
    def __insert_parameter(self, name, dataset_type_id):
        sql = "INSERT INTO parameters (name, dataset_type_id) VALUES (%s, %s)"
        val = (name,dataset_type_id)
        mycursor.execute(sql, val)

        mydb.commit()

        return mycursor.lastrowid

    # get parameter id from name, if it does not exist insert it and return id
    def get_parameter_id(self, name, dataset_type_id):
        sql = "SELECT * FROM parameters WHERE name = %s AND dataset_type_id = %s"
        adr = (name, dataset_type_id )

        mycursor.execute(sql, adr)
        myresult = mycursor.fetchall()

        if mycursor.rowcount == 0:
            return self.__insert_parameter(name, dataset_type_id)

        return myresult[0][0]

    # insert parameter value, returns id
    def __insert_parameter_value(self, name, parameter_id):
        sql = "INSERT INTO parameter_values (name, parameter_id) VALUES (%s, %s)"
        val = (name, parameter_id)
        mycursor.execute(sql, val)

        mydb.commit()

        return mycursor.lastrowid

    # fet id of parameter value based on name, if it does not exist insert it and return id
    def get_parameter_value_id(self, name, parameter_id):
        sql = "SELECT * FROM parameter_values WHERE name = %s AND parameter_id = %s"
        adr = (name,parameter_id )

        mycursor.execute(sql, adr)
        myresult = mycursor.fetchall()

        if mycursor.rowcount == 0:
            return self.__insert_parameter_value(name, parameter_id)

        return myresult[0][0]
    
    # returns district id based on name
    def get_district_id(self, name):
        sql = "SELECT * FROM districts WHERE name = %s"
        adr = (name,)

        mycursor.execute(sql, adr)
        myresult = mycursor.fetchall()

        return myresult[0][0]


# pip install mysql-connector-python 
import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="dekk_project",
  password="2810pRojecT",
  database="datasets"
)

mycursor = mydb.cursor()

dat = Dataset()
dat.dataset_type_id = 3
dat.parameter_value_ids = [5]
dat.data = {}
dat.year = 1999

for d in range(1, 80):
    dat.data[d] = 0.5

dat.insert()

mycursor.close ()
mydb.close ()
from flask import Flask, jsonify, request, render_template
app = Flask(__name__)

# Sample data
# this would be great to place in DB --> MongoDB for example
data = {
    "cars": [
        {"id": 1, "model": "One", "brandId": 1},
        {"id": 2, "model": "Two", "brandId": 2},
        {"id": 3, "model": "Two", "brandId": 1}
    ],
    "brands": [
        {"id": 1, "name": "One", "companyId": 1},
        {"id": 2, "name": "Two", "companyId": 2}
    ],
    "companies": [
        {"id": 1, "name": "One"},
        {"id": 2, "name": "Two"}
    ],

}

@app.route('/')
def home():
    return render_template('index.html')

# API to retrieve car data by its ID
# We want to distinguish id=2 vs id=002 --> same logic could also apply for brand/model
# @app.route('/cars/<int: car_id>', methods=['GET']) <- this logic was not giving us possibility to do it as 02 and 2 was treated the same
@app.route('/cars/<car_id>', methods=['GET'])
def get_car(car_id):
    car = [car for car in data['cars'] if str(car['id']) == car_id]
    if len(car) == 0:
        return jsonify({'message': 'Car not found'}), 404
    return jsonify(car[0])

# API to retrieve brand data by its ID
@app.route('/brands/<brand_id>', methods=['GET'])
def get_brand(brand_id):
    brand = [brand for brand in data['brands'] if str(brand['id']) == brand_id]
    if len(brand) == 0:
        return jsonify({'message': 'Brand not found'}), 404
    return jsonify(brand[0])

# API to retrieve company data by its ID
@app.route('/companies/<company_id>', methods=['GET'])
def get_company(company_id):
    company = [company for company in data['companies'] if str(company['id']) == company_id]
    if len(company) == 0:
        return jsonify({'message': 'Company not found'}), 404
    return jsonify(company[0])

if __name__ == '__main__':
    app.run()

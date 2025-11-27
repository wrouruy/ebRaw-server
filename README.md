## How to run the code?
1. clone the repo: ``` git clone https://github.com/wrouruy/ebRaw-server.git ```
2. Enter your ``` MONGO_URI ``` in  ``` .env ```!
3. install packages: ``` npm install ```
4. create "/uploads" directory: ``` mkdir uploads ```
5. run the code: ``` node app ```

## EndPoints:
### Goods (GET):
    1. /all-goods       : get all goods
    2. /random-goods    : get random goods
    3. /id-goods/:id    : find goods by id
### Goods (POST):
    1. /add-goods:
    {
        "name": String
        "image" Image (File)
        "price": Number
        "collection": String
    }

### Collections(GET):
    1. /all-collections                   : get all collecions
    2. /random-collection                 : get random collection
    3. /find-collection/:id?q=id/title    : find collection by id or title (to search by title, enter it in q), query is not required
    4. /goods-in-collection/:collection   : get all goods in collection
### Collections(POST):
    1. /add-collection:
    {
        "title": String        : unique, required
        "slug": String
        "description": String
    }
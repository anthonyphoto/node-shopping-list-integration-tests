const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Recipe", function() {
    before(function() {
        return runServer();
    });
    after(function(){
        return closeServer();
    });
    
    it("should list on GET Recipe", function(){
        return chai.request(app)
            .get("/recipes")
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.at.least(1);

                res.body.forEach(function(item) {
                    expect(item).to.be.a("object");
                    expect(item).to.include.keys(["name", "id", "ingredients"]);
                });

            });
    });

    it("should create a new recipe on POST", function(){
        const newItem = { name: "xyz", ingredients: ["a", "b", "c"]}
        return chai.request(app)
            .post("/recipes")
            .send(newItem)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.include.keys(["name", "id", "ingredients"]);
                expect(res.body.id).to.be.not.equal(null);

                expect(res.body).to.be.deep.equal(Object.assign(newItem, { id: res.body.id }));

            });
    });

    it("shoud update an existing item on PUT", function(){
        const updatedItem = { name: "zzz", ingredients: ["d", "e", "f"]};
        return chai.request(app)
            .get("/recipes")
            .then(function (res){
                updatedItem.id = res.body[0].id;
                return chai.request(app)
                    // .put(`/recipes`)
                    .put(`/recipes/${updatedItem.id}`)
                    .send(updatedItem);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
                // console.log("test");
                // console.log(res);
                // expect(res).to.be.json;
                /* expect(res.body).to.be.a("object");
                expect(res.body).to.include.keys(["id", "name", "ingredients"]);
                expect(res.body.id).to.be.not.equal(null);
                expect(res.body).to.be.deep.equal(Object.assign(updatedItem, {id: res.body.id}));
                */
            });
    });

    it("should delete on DELETE", function(){
        return chai.request(app)
            .get('/recipes')
            .then(function(res){
                return chai.request(app)
                    .delete(`/recipes/${res.body[0].id}`)
            })
            .then (function(res){
                expect(res).to.have.status(204);

            });
    })

});
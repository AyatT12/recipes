const MealsContainer = document.getElementById("MealsContainer");
const DataRow = document.getElementById("DataRow");
const searchContainer = document.getElementById("searchContainer")
const Search = document.getElementById("Search")
const Categories = document.getElementById("Categories")
const Area = document.getElementById("Area")
const Ingredients = document.getElementById("Ingredients")
const Contact = document.getElementById("Contact")
const inner_loading_screen=document.getElementById("inner-loading-screen")
// ///////////////////////////////////////////////////////////////////////////////////

$(document).ready(() => {
    GetAllItems("").then(() => {
        $(".loading-screen").fadeOut(700);
        $("body").css("overflow", "visible");
    });
});
function loaderDisplay(){
    inner_loading_screen.style.display="flex"
    $("#inner-loading-screen").fadeOut(500);

}

function openSideNav() {
    
    $(".side-nav-menu").animate(
        {
            left: 0,
        },
        500
    );

    $(".open-close-icon").removeClass("fa-align-justify ");
    $(".open-close-icon").addClass("fa-x pos");
    for (let i = 0; i < 5; i++) {
        $(".links li")
            .eq(i)
            .animate(
                {
                    top: 0,
                },
                (i + 5) * 100
            );
    }
}

function closeSideNav() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
    $(".side-nav-menu").animate(
        {
            left: -320,
        },
        500
    );

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x pos");

    $(".links li").animate(
        {
            top: 200,
        },
        500
    );
}

closeSideNav();
$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") == "0px") {
        closeSideNav();
    } else {
        openSideNav();
    }
});

// ///////////////////////////////////////////////////////////////////////////////////

async function GetAllItems() {
    let response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${""}`
    );
    response = await response.json();
     AllMeals = response.meals;
    DisplayMeals(AllMeals)
}

async function DisplayMeals(AllMeals) {
    
    let Data = "";

   if(AllMeals.length==0){
        DataRow.innerHTML = Data;
   }else{

    for (let i = 0; i < AllMeals.length; i++) {
        Data += `
        <div class="col-md-3 ">
        <div class="MealDiv" style="position: relative;">
                <div onclick = "getDetails('${AllMeals[i].idMeal}')"class="rounded-2 text-center cursor-pointer" style="border: 4px solid pink;">
                       <img src="${AllMeals[i].strMealThumb}" class="w-100">
                       <div class="mealLeyar "><h2>${AllMeals[i].strMeal}</h2></div>
                </div>
            </div>
        </div>
        `;
    }

    DataRow.innerHTML = Data;
}
}
async function getDetails(MealId) {
    let ingredients = ``
    loaderDisplay()
    let response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${MealId}`
    );
    response = await response.json();
   let meal = response.meals;

   let Ingredn ="";
  for(let i=1; i<=20; i++)  {
    if (meal[0][`strIngredient${i}`]){
        Ingredn += `<li class="alert alert-info m-2 p-1">${meal[0][`strMeasure${i}`]} ${meal[0][`strIngredient${i}`]}</li>`
    }
   }
//    console.log(Ingredn)

    if (meal[0].strTags == null) {
        meal[0].strTags = "";
    }
    let DataDetails = "";
    DataDetails += ` <div class="col-md-4">
    <img class="w-100 rounded-3" src="${meal[0].strMealThumb}"
        alt="">
        <h2>${meal[0].strMeal}</h2>
</div>
<div class="col-md-8">
    <h2>Instructions</h2>
    <p>${meal[0].strInstructions}</p>
    <h3><span class="fw-bolder">Area : </span>${meal[0].strArea}</h3>
    <h3><span class="fw-bolder">Category : </span>${meal[0].strCategory}</h3>
    <h3>Recipes :</h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">
       ${Ingredn}
    </ul>

    <h3>Tags :</h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">
    <p style="background-color: #d1a3a3;padding: 4px;border-radius: 5px;" >
    ${meal[0].strTags}
    </p>
    </ul>

    <a target="_blank" href="${meal[0].strSource}" class="btn btn-success">Source</a>
    <a target="_blank" href="${meal[0].strYoutube}" class="btn btn-danger">Youtube</a>
</div>`;

    DataRow.innerHTML = DataDetails;
}
// ///////////////////////////////////////////////////////////////////////////////////

Search.addEventListener("click", function () {
    Displaysearch()
})
function Displaysearch() {
    closeSideNav()
    let searchInputs = ``;
    searchInputs += `
    <div class=" row py-4">
            <div class="col-md-6">
                <input type="text" name="searchByname" class="form-control  bg-transparent text-white " placeholder="Search By Name" onkeyup="SearchByname(this.value)">
            </div>
            <div class="col-md-6">
                <input type="text" name ="searchByLetter" class="form-control bg-transparent text-white" placeholder="Search By First Letter"  onkeyup="SearchByletter(this.value)">
            </div>
    </div>
    `
    searchContainer.innerHTML = searchInputs;
    DataRow.innerHTML = "";
}

async function SearchByname(name) {
    loaderDisplay()
    if(name!=null){
    let response = await fetch(`https:www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    response = await response.json();
    mealsList = response.meals;
    DisplayMeals(mealsList)
    }
    else{
        DisplayMeals([])

    }
}
async function SearchByletter(Letter) {
    loaderDisplay()
    if(Letter!=""){
    let response = await fetch(`https:www.themealdb.com/api/json/v1/1/search.php?f=${Letter}`)
    response = await response.json();
    mealsList = response.meals;
    DisplayMeals(mealsList)
    }
    else{
        let response = await fetch(`https:www.themealdb.com/api/json/v1/1/search.php?f=a`)
        response = await response.json();
        mealsList = response.meals;
        DisplayMeals(mealsList)
    }
}
// ///////////////////////////////////////////////////////////////////////////////////

Categories.addEventListener("click", function () {
    DisplayCategories()
})
async function DisplayCategories() {
    loaderDisplay()
    closeSideNav()
    searchContainer.innerHTML = "";
    DataRow.innerHTML = "";
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    response = await response.json();
    let Categories = response.categories
    let Categorie = "";

    for (let i = 0; i < Categories.length; i++) {
        Categorie += `
        <div class="col-md-3 ">
        <div class="MealDiv" style="position: relative;">
        <div onclick = "getCategoryMeals('${Categories[i].strCategory}')" class="rounded-2 text-center cursor-pointer">
                       <img src="${Categories[i].strCategoryThumb}" class="w-100">
                       <div class="mealLeyar   flex-column" >
                       <h3>${Categories[i].strCategory}</h3>
                       <p>${Categories[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                       </div>
                </div>
            </div>
        </div>
        `;


        DataRow.innerHTML = Categorie;
    }

}
async function getCategoryMeals(Categoriee) {
    loaderDisplay()
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${Categoriee}`)
    response = await response.json();
    let MealCategorie = response.meals
    DisplayMeals(MealCategorie)
}
// ///////////////////////////////////////////////////////////////////////////////////

Area.addEventListener("click", function () {
    DisplayArea()
})
async function DisplayArea() {
    loaderDisplay()
    closeSideNav()
    searchContainer.innerHTML = "";
    DataRow.innerHTML = "";
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    response = await response.json();
    let Area = response.meals
    let Areas = "";

    for (let i = 0; i < Area.length; i++) {
        Areas += `
        <div onclick = "getAreaMeals('${Area[i].strArea}')" class="col-md-3  text-center">
        <i class="fa-solid fa-house-laptop fa-4x"></i>
          <h3>${Area[i].strArea} </h3>
        </div>
        `;


        DataRow.innerHTML = Areas;
    }

}

async function getAreaMeals(Area) {
    loaderDisplay()
    closeSideNav()
    DataRow.innerHTML = "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${Area}`)
    response = await response.json();
    let meals = response.meals
    DisplayMeals(meals)
}
// ///////////////////////////////////////////////////////////////////////////////////


Ingredients.addEventListener("click", function () {
    DisplayIngredients()
})
async function DisplayIngredients() {
    loaderDisplay()
    closeSideNav()
    searchContainer.innerHTML = "";
    DataRow.innerHTML = "";
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
    response = await response.json();
    let Ingredients = response.meals
    let Ingredientss = "";

    for (let i = 0; i < Ingredients.length; i++) {
        Ingredientss += `
        <div onclick = "getIngredientsMeals('${Ingredients[i].strIngredient}')" class="col-md-3  text-center">
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
         <h3>${Ingredients[i].strIngredient} </h3>
         <p>${Ingredients[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
         </div>
        `;
        DataRow.innerHTML = Ingredientss;
    }

}

async function getIngredientsMeals(Ingredient) {
    loaderDisplay()
    closeSideNav();
    DataRow.innerHTML = "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${Ingredient}`);
    response = await response.json();
    let meals = response.meals;
    DisplayMeals(meals)
}
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Contact.addEventListener("click", function () {
    DisplayContact()
})
async function DisplayContact() {
    loaderDisplay()
    closeSideNav();
  let contact='';
  contact +=`
  <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="isNameValid() , inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name" fdprocessedid="lzwp8h">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2  ">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="isEmailValid(), inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email" fdprocessedid="sriutv">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2  ">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="isPhoneValid(), inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone" fdprocessedid="3isr0q">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2  ">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="isAgeValid(), inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age" fdprocessedid="5ih1fr">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2  ">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input id="passwordInput" onkeyup="isPasswordValid(), inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password" fdprocessedid="8c5dqd">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2  ">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input id="repasswordInput" onkeyup="arePasswordsMatching(), inputsValidation()" type="password" class="form-control " placeholder="Repassword" fdprocessedid="bgzu6e">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 ">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled="" class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div>
  ` 
  DataRow.innerHTML = contact; 
}
function isNameValid() {
    const nameInput = document.getElementById("nameInput").value;
    const nameAlert = document.getElementById("nameAlert")
    const nameRegx = /^[a-zA-Z\s]+$/;
    if ( nameRegx.test(nameInput)==false){
        nameAlert.style.display="block"
    }else{
        nameAlert.style.display="none" 
    }
    return nameRegx.test(nameInput);
}

function isEmailValid() {
    const emailInput = document.getElementById("emailInput").value;

    const emailRegx = /^[\w.-]+@[\w.-]+\.[\w-]+(\.[\w-]+)*$/;
    const emailAlert = document.getElementById("emailAlert")

    if ( emailRegx.test(emailInput)==false){
        emailAlert.style.display="block"
    }else{
        emailAlert.style.display="none" 
    }
    return emailRegx.test(emailInput);
}

function isPhoneValid() {
    const phoneInput = document.getElementById("phoneInput").value;
    const phoneRegx =/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const phoneAlert = document.getElementById("phoneAlert")

    if ( phoneRegx.test(phoneInput)==false){
        phoneAlert.style.display="block"
    }else{
        phoneAlert.style.display="none" 
    }


    return phoneRegx.test(phoneInput);
}

function isAgeValid() {
    const ageInput = document.getElementById("ageInput").value; 
    const ageRegx = /^(?:[1-9]|[1-9][0-9])$/;
    const ageAlert = document.getElementById("ageAlert")

    if ( ageRegx.test(ageInput)==false){
        ageAlert.style.display="block"
    }else{
        ageAlert.style.display="none" 
    }

    return ageRegx.test(ageInput);
}

function isPasswordValid() {
    const passwordInput = document.getElementById("passwordInput").value;
    const passwordRegx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const passwordAlert = document.getElementById("passwordAlert")

    if ( passwordRegx.test(passwordInput)==false){
        passwordAlert.style.display="block"
    }else{
        passwordAlert.style.display="none" 
    }
    return passwordRegx.test(passwordInput);
}

function arePasswordsMatching() {
    const passwordInput = document.getElementById("passwordInput").value;
    const repasswordInput = document.getElementById("repasswordInput").value;
    if ( passwordInput != repasswordInput){
        repasswordAlert.style.display="block"
    }else{
        repasswordAlert.style.display="none" 
    }

    return passwordInput === repasswordInput;
}


function inputsValidation() {
    const submitBtn = document.getElementById("submitBtn");
    
    if (
        isNameValid() &&
        isEmailValid() &&
        isPhoneValid() &&
        isAgeValid() &&
        isPasswordValid() &&
        arePasswordsMatching()
    )  {submitBtn.removeAttribute("disabled")}
    else {
    submitBtn.setAttribute("disabled", true)}

}

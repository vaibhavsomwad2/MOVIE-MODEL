let cl = console.log;

let showModel = document.getElementById('showModel');
let backDrop = document.getElementById('backDrop');
let mymodel = document.getElementById('mymodel');
let hideModel = Array.from(document.querySelectorAll('.hideModel'));
let Addmovie = document.getElementById('Addmovie');
let movieForm = document.getElementById('movieForm');
let title = document.getElementById('title');
let Url = document.getElementById('Url');
let rating =document.getElementById('rating');
let movieContainer = document.getElementById('movieContainer');
let movieArray =[];

let UpdateBtn = document.getElementById("UpdateBtn");

let baseUrl = ` http://localhost:3000`;


let tokenValue = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
localStorage.setItem("token",tokenValue)
const MakeAPICall = (methodName,Url,body) =>{
    return new Promise((resolve,reject)=>{
        let xhr = new XMLHttpRequest();
        xhr.open(methodName,Url);
        xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        xhr.setRequestHeader("aut","token")
        xhr.onload = function (){
          if((xhr.status === 200 || xhr.status === 201) && xhr.readyState === 4){
            resolve(xhr.response)
          }else{
            reject("something went wrong !!!")
          }  
        }
        xhr.send(body)
    })
}
let MovieUrl = `${baseUrl}/Movie`;
MakeAPICall("GET",MovieUrl)
    .then(res => templating(JSON.parse(res)))
    .catch(cl)

const handelBackDropModel = () =>{
    backDrop.classList.toggle('show');
    mymodel.classList.toggle('show');
}

const showModelclick = (e) =>{
    handelBackDropModel();
}








// const AddmovieHandler = (e) =>{
//     e.preventDefault();
//     let obj ={
//         titleName :title.value,
//         imgUrl : Url.value,
//         ratingValue :rating.value,
//     }
//     movieArray.push(obj)
//     movieForm.reset();
//     handelBackDropModel();


//     let result ='';
//     movieArray.forEach(movie =>{
//         result +=`<div class="col-md-4 mt-4">
//         <div class="card moviecard">
//             <div class="card-body">
//                 <figure>
//                     <img class="img-responsive" src="${movie.imgUrl}" alt="" >
//                     <figcaption>
//                         <h3 class="title">${movie.titleName}</h3>
//                         <p class="rating">${movie.ratingValue}/5</p>
//                     </figcaption>
//                 </figure>
//             </div>
//         </div>
//     </div>`
//     })
//     movieContainer.innerHTML = result;
// }

const AddmovieHandler = (eve) =>{
    eve.preventDefault();
    let Obj = {
        titleName : title.value,
        imgUrl : Url.value,
        ratingValue : rating.value 
    }
    let POSTUrl = `${baseUrl}/Movie`
    MakeAPICall("POST",POSTUrl,JSON.stringify(Obj))
        .then(res => {
           cl(res)
        })
        .catch(cl)
    eve.target.reset();
    handelBackDropModel();
}

const onEdithandler = (ele) =>{
    let getid = ele.dataset.id;
    localStorage.setItem("setData",getid)
    let EditUrl = `${baseUrl}/Movie/${getid}`
    MakeAPICall("GET",EditUrl)
    .then(res => {
        let data = JSON.parse(res);
        title.value = data.titleName;
        Url.value = data.imgUrl;
        rating.value = data.ratingValue
    })
    UpdateBtn.classList.remove("d-none");
    Addmovie.classList.add("d-none");
        showModelclick() 

}

const onUpdateHandler = () =>{
    let getid = localStorage.getItem("setData");
    let UpdatUrl = `${baseUrl}/Movie/${getid}`
    let obj ={
        titleName : title.value,
        imgUrl : Url.value,
        ratingValue : rating.value 
    }
    MakeAPICall("PATCH",UpdatUrl,JSON.stringify(obj))
    .then(cl)
    .catch(cl)
}

const onDeletehandler = (ele) =>{
    let getid = ele.dataset.id;
    let DeleteUrl = `${baseUrl}/Movie/${getid}`
    MakeAPICall("DELETE",DeleteUrl)
    .then(cl)
    .catch(cl)
}
const templating = (arr) =>{
    let result = '';
    arr.forEach((movie)=>{
        result +=`
        <div class="col-md-4 mt-4">
        <div class="card moviecard">
            <div class="card-body">
                 <figure>
                     <img src="${movie.imgUrl}" class="img-responsive"  alt="">
                   <figcaption>
                       <h3 class="title"> Title : ${movie.titleName}</h3>
                       
                     <p class="rating"> <strong>Rating :</strong> ${movie.ratingValue}/5  </p>
                     <p class="text-right">
                     <button class="btn btn-success" onclick="onEdithandler(this)" data-id="${movie.id}">Edit</button>

                     <button class="btn btn-danger" onclick="onDeletehandler(this)" data-id="${movie.id}">Delete</button>
                     </p>
                 </figcaption>
               </figure>
            </div>
        </div>
    </div>
     `
    })
    movieContainer.innerHTML = result;
}




UpdateBtn.addEventListener("click",onUpdateHandler);
showModel.addEventListener('click', showModelclick);
backDrop.addEventListener('click', handelBackDropModel);
// Addmovie.addEventListener('submit', AddmovieHandler)
movieForm.addEventListener('submit', AddmovieHandler);
hideModel.forEach(ele =>{
    ele.addEventListener('click', handelBackDropModel)
});
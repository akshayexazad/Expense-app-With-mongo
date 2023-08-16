const pagination = document.getElementById('pagination');
const selectElement = document.getElementById('rowPerPage');
var universalbtnnext  = document.getElementById("pagination_btn_next");
var universalbtnprev  = document.getElementById("pagination_btn_prev");
var token = localStorage.getItem('token')


// console.log(selectElement.value)


selectElement.addEventListener("change", async () => {
  let token = localStorage.getItem('token')

  const selectedOption = selectElement;
  const no_of_item = selectedOption.value;
  const expenseLI = await axios.get(`http://localhost:3000/expense/getExpense?param1=${1}&param2=${no_of_item}`, { headers: { "Authorization": token } });

  document.getElementById('listOfUsers').innerHTML = '';
  for (let index = 0; index < expenseLI.data.users.length; index++) {
     showOrderOnSreen(expenseLI.data.users[index]);
  }

})

async function expense(event) {
  event.preventDefault();
  const obj = {
    price: event.target.price.value,
    category: event.target.category.value,
    description: event.target.description.value
  };

  const token = localStorage.getItem('token')
  //for post
  await axios.post('http://localhost:3000/expense/add-expensedata', obj, { headers: { "Authorization": token } })
    .then((Res) => {

      showOrderOnSreen(Res.data.newuser);

    }).catch((err) => {
      document.body.innerHTML = document.body.innerHTML + "somthing went wrong";
      console.log(err.message);
    })
};

// already premium user
function showPremiumUserMessage() {
  document.getElementById('rze-pay-btn').style.visibility = "hidden";
  document.getElementById('add-premium').innerHTML = 'You Are a Premium User'

}
function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

// for get Request 

window.addEventListener("DOMContentLoaded", async () => {
  let page = 1;
  var item_per_page = 5
  const token = localStorage.getItem('token')
  const decodeToken = parseJwt(token)
  const isAdmin = decodeToken.ispremiumuser;
  if (isAdmin) {
    showPremiumUserMessage()
    showLeaderBord()

  }

  const expenseLI = await axios.get(`http://localhost:3000/expense/getExpense?param1=${page}&param2=${item_per_page}`, { headers: { "Authorization": token } });
  var totalNodata = expenseLI.data.lastPage;
  console.log(expenseLI)
  for (var i = 0; i < expenseLI.data.users.length; i++) {
    showOrderOnSreen(expenseLI.data.users[i])
  }

});
// pagination next
  universalbtnnext.addEventListener('click',async()=>{
    const item_per_page = 5
    const incrementbtn =  document.getElementById("pagenumber");
    let val=Number(incrementbtn.innerText)
    
     val++
     incrementbtn.innerText=val 
     const expenseLI = await axios.get(`http://localhost:3000/expense/getExpense?param1=${val}&param2=${item_per_page}`, { headers: { "Authorization": token } });
    
    if(expenseLI.data.users.length<item_per_page){
      console.log(expenseLI.data.users.length,'if wala part');
      universalbtnnext.style.display ="none"
    }


     document.getElementById('listOfUsers').innerHTML = '';
     for (var i = 0; i < expenseLI.data.users.length; i++) {
      showOrderOnSreen(expenseLI.data.users[i])
    }

  });

  // pagination previous
  universalbtnprev.addEventListener('click',async()=>{
    const item_per_page = 5
    const decrementbtn =  document.getElementById("pagenumber");
    
    let val=Number(decrementbtn.innerText)
    if(val>1){
      val--
      decrementbtn.innerText=val 
      const expenseLI = await axios.get(`http://localhost:3000/expense/getExpense?param1=${val}&param2=${item_per_page}`, { headers: { "Authorization": token } });
      document.getElementById('listOfUsers').innerHTML = '';
      if(expenseLI.data.users.length == item_per_page){
        universalbtnnext.style.display ="block"
      }

      for (var i = 0; i < expenseLI.data.users.length; i++) {
       showOrderOnSreen(expenseLI.data.users[i])
     }
    }else{
      alert('There is No Previous Data Available...')
    } 
  });


// for Showuser on screen
function showOrderOnSreen(order) {
  document.getElementById("price").value = "";
  document.getElementById("category").value = "";
  document.getElementById("description").value = "";
  const parentNode = document.getElementById("listOfUsers");
  const childHTML = `<li id=${order._id}> ₹${order.price} - ${order.category} - ${order.description} 
     <button onclick=deleteUser('${order._id}')> Delete</button> </li>`;
  parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

//for edit User 

function editUserDetails(price, category, description, userid) {
  document.getElementById("price").value = price;
  document.getElementById("category").value = category;
  document.getElementById("description").value = description;
  edituserid = userid;
  removeUserFromScreen(userid);


}


// for Delete user

function deleteUser(user) {
  console.log(user)
  let token = localStorage.getItem('token')

  axios.delete(`http://localhost:3000/expense/delete-expense/${user}`, { headers: { 'Authorization': token } })
    .then((res) => {
      console.log(res)
      removeUserFromScreen(user);
    }).catch((err) => {
      let error = err.response.data.message;
      document.getElementById('color-for-error').innerHTML = `<span style='color: red;'>${error}</span>`;
    });
};

// for remove user from screen

function removeUserFromScreen(user) {
  const parentNode = document.getElementById("listOfUsers");
  const childNodeToBeDeleted = document.getElementById(user);
  if (childNodeToBeDeleted) {
    parentNode.removeChild(childNodeToBeDeleted);
  }
};

// for razor pay payment

document.getElementById('rze-pay-btn').onclick = async function (e) {

  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: { 'Authorization': token } })

  var options = {
    "key": response.data.key_id,
    "order_id": response.data.order.id,
    "handler": async function (response) {
      const res = await axios.post('http://localhost:3000/purchase/premiumUpdateStatus', {
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,

      }, { headers: { 'Authorization': token } });
      // remove button

      const dltbtn = document.getElementById("rze-pay-btn");
      dltbtn.parentNode.removeChild(dltbtn);
      // add list item
      const node = document.createElement("h3");
      const textnode = document.createTextNode("You are a Premium user");
      node.appendChild(textnode);
      document.getElementById("add-premium").appendChild(node);
      localStorage.setItem('token', res.data.token);
      //premium user features
      showLeaderBord()

    }
  }



  const rzpl = new Razorpay(options);
  rzpl.open();
  e.preventDefault();
  rzpl.on('payment fail', function (response) {
    alert("somthing went wrong")
  })

};
//leader bord 

function showLeaderBord() {

  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.value = 'Show Leaderboard';
  inputElement.onclick = async () => {
    const token = localStorage.getItem('token');
    const userLeaderboardArray = await axios.get('http://localhost:3000/premium/showleaderboard', { headers: { "Authorization": token } });
    const leaderboardElm = document.getElementById('leader-board');
    leaderboardElm.innerHTML += `<h1>Leader Board </h1>`;
    userLeaderboardArray.data.forEach((user) => {
      leaderboardElm.innerHTML += `<li> Name :- ${user.name} and Total Expense :- ${user.totalExpenses}`
    })

  }
  document.getElementById('userleader-button').appendChild(inputElement)
}




// for download features
function download() {
  const token = localStorage.getItem('token');
  axios.get('http://localhost:3000/user/download', { headers: { "Authorization": token } })
    .then((response) => {
      if (response.status === 200) {
        // console.log(response.data.fileURL)
        var a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = 'myexpense.csv';
        a.click();
      } else {
        throw new Error(response.data.message)
      }

    })
    .catch((err) => {
      console.log(err)
    });
};

async function downloadfiledata(){
  const token = localStorage.getItem('token')
  try {
    const downloaddetail = await axios.get('http://localhost:3000/user/downloadfiledata', { headers: { "Authorization": token } })

    // console.log(downloaddetail)
    var downloadElem = document.getElementById('downloadedfile')
    downloadElem.innerHTML += '<h1> All Downloads </<h1>'
    for (let i = 0; i <= downloaddetail.data.downloadFileData.length; i++) {
      // console.log(downloaddetail.data.downloadFileData[i].downloaddate)
      downloadElem.innerHTML += `<li>downloadDate - ${downloaddetail.data.downloadFileData[i].downloaddate}
          URL - ${downloaddetail.data.downloadFileData[i].filename} 
          <button onClick = downloadFile('${downloaddetail.data.downloadFileData[i].filename}')>download</button></li>`
    }


  } catch (err) {
    console.log(err)
  }
};

function downloadFile(fileUrl) {
  var url = fileUrl; // replace with your file URL
  var a = document.createElement('a');
  a.href = url;
  a.download = 'Expense.pdf'; // replace with your desired file name
  a.click();
}
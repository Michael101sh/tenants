<template>
    <div class="main_container">
      <form v-on:submit.prevent
            method="post">
        <h4>להרשמה כדייר, נא מלא/י את הטופס הבא:</h4>
        <caption>הרשמה</caption>
        <div>
          <label><strong>שם</strong></label>
          <input type="text"
                 class="form-control"
                 v-model="user.name"
                 placeholder="רשמ/י את שמך"
                 v-on:change="nameValidate">
          <small class="form-text" style="color:red;">
            {{nameErrorMessage}}</small>
        </div>
        <div>
          <label><strong>פלאפון / טלפון</strong></label>
          <input type="text" name="Tel"
                 class="form-control"
                 v-model="user.phone"
                 placeholder="רשמ/י פלאפון / טלפון"
                 v-on:change="phoneValidate">
          <small class="form-text" style="color:red;">
            {{phoneErrorMessage}}</small>
        </div>
        <div>
          <label><strong>כתובת</strong></label>
          <input type="text" name="address"
                 class="form-control"
                 v-model="user.address"
                 placeholder="רשמ/י כתובת"
                 v-on:change="addressValidate">
          <small class="form-text" style="color:red;">
            {{addressErrorMessage}}</small>
        </div>
        <div>
          <label><strong>חוב</strong></label>
          <input type="text"
                 class="form-control"
                 v-model="user.debt"
                 placeholder="רשמ/י את סכום החוב שלך אם קיים"
                 v-on:change="debtValidate">
          <small class="form-text" style="color:black;">
                רשמ/י את סכום החוב שלך אם קיים
          </small>
          <small class="form-text" style="color:red;">
            {{debtErrorMessage}}</small>
        </div>
        <input class="submitForm" type="submit" value="הירשמ/י"
               v-on:click="registerFormValidation">
      </form>
      <br>
      <div dir="rtl">
        <form>
          <h4>הצג את הדיירים הבאים:</h4>
          <input type="radio" name="option"
                 v-on:click="callAppropriateGet(1)"> כולם <br>
          <input type="radio" name="option"
                 v-on:click="callAppropriateGet(2)"> בעלי חובות<br>
          <input type="radio" name="option"
                 v-on:click="callAppropriateGet(3)">  ללא חובות
        </form>
        <table class="table">
          <caption>משתמשים</caption>
          <tr>
            <th colspan="5">
              <label> חיפוש דייר:</label>
              <input type="text" style="margin:0 auto"
                     v-model="searchQuery"
                     v-on:input="showRelevantUsers">
            </th>
          </tr>
          <tr>
            <th>שם דייר</th>
            <th>טלפון</th>
            <th>כתובת</th>
            <th>חוב</th>
            <th>האם למחוק?</th>
          </tr>
          <tr v-for="element in relevantUsers">
            <td> {{element.username}} </td>
            <td> {{element.phone}} </td>
            <td> {{element.address}} </td>
            <td> {{element.debt}} </td>
            <td><click-confirm><input type="checkbox"
                                      v-on:click=
                                        "deleteUser(element.username)">
            </click-confirm> </td>
          </tr>
        </table>
      </div>
      <form name="updateForm" v-on:submit.prevent
          method="post">
        <caption>עדכון פרטים</caption>
        <div>
          <label><strong>שם הדייר שאת/ה רוצה לעדכן</strong></label>
          <input type="text"
                 class="form-control"
                 v-model="userToUpdate"
                 placeholder="רשמ/י שם דייר קיים">
          <label><strong> שם חדש</strong></label>
          <input type="text"
                 class="form-control"
                 v-model="updatedUser.username"
                 placeholder="רשמ/י שם חדש">
          <small class="form-text" style="color:red;">
            {{nameErrorMessage}}</small>
        </div>
        <div>
          <label><strong>פלאפון / טלפון חדש</strong></label>
          <input type="text" name="Tel"
                 class="form-control"
                 v-model="updatedUser.phone"
                 placeholder="רשמ/י פלאפון / טלפון חדש"
                 v-on:change="phoneValidate">
          <small class="form-text" style="color:red;">
            {{phoneErrorMessage}}</small>
        </div>
        <div>
          <label><strong>כתובת חדשה</strong></label>
          <input type="text" name="address"
                 class="form-control"
                 v-model="updatedUser.address"
                 placeholder="רשמ/י כתובת חדשה">
          <small class="form-text" style="color:red;">
            {{addressErrorMessage}}</small>
        </div>
        <div>
          <label><strong>חוב מעודכן</strong></label>
          <input type="text"
                 class="form-control"
                 v-model="updatedUser.debt"
                 placeholder="רשמ/י את סכום החוב המעודכן">
          <small class="form-text" style="color:black;">
            רשמ/י את סכום החוב המעודכן
          </small>
          <small class="form-text" style="color:red;">
            {{debtErrorMessage}}</small>
        </div>
        <input class="submitForm" type="submit" value="עדכנ/י"
               v-on:click="updateUser">
      </form>
    </div>
</template>

<script>
export default {
  name: 'TenantsManagement',
  data () {
    return {
      nameErrorMessage: '',
      phoneErrorMessage: '',
      addressErrorMessage: '',
      debtErrorMessage: '',
      nameGreenOn: false,
      phoneGreenOn: false,
      addressGreenOn: false,
      debtGreenOn: true,
      users: this.getAllUsers(),
      userToUpdate: '',
      searchQuery: '',
      relevantUsers: [],
      user: {
        name: '',
        phone: '',
        address: '',
        debt: 0,
      },
      updatedUser: {
        username: '',
        phone: '',
        address: '',
        debt: 0,
      }
    }
  },
    methods: {
      addUser() {
        let url = 'http://' +
            location.hostname + ':3001/api/registerUser';
        this.axios.post(url, this.user).then((response) => {
          console.log(response);
          alert("נרשמת בהצלחה!");
          this.callAppropriateGet(1);
        }).catch((error) => {
            console.log(error.config);
            alert("ההרשמה לא הצליחה, ייתכן ששם המשתמש תפוס. נסה/י שוב!");
        });
        this.user = {};
      },
      getAllUsers() {
        let url = 'http://' +
          location.hostname + ':3001/api/getUsers';
        this.axios.get(url).then((res) => {
          this.initUsers(res.data);
        }).catch((error) => {
            console.log(error.config);
        });
        return[];
      },
      getUserWithDebts() {
        let url = 'http://' +
          location.hostname + ':3001/api/getUsersWithDebts';
        this.axios.get(url).then((res) => {
          this.initUsers(res.data);
        }).catch((error) => {
          console.log(error.config);
        });
        return[];
      },
      getUserWithoutDebts() {
        let url = 'http://' +
          location.hostname + ':3001/api/getUsersWithoutDebts';
        this.axios.get(url).then((res) => {
          this.initUsers(res.data);
        }).catch((error) => {
          console.log(error.config);
        });
        return[];
      },
      updateUser() {
        let url = 'http://' + location.hostname +
          ':3001/api/updateUser/' + this.userToUpdate;
        this.axios.put(url, this.updatedUser)
            .then(res => {
            console.log(res);
              this.callAppropriateGet(1);
              alert('המשתמש עודכן בהצלחה')
            })
          .catch(error => {
            console.log(error);
            alert('משתמש לא קיים. נסה/י שוב')
          });
      },
      deleteUser(userToDelete)  {
        let url = 'http://' + location.hostname +
          ':3001/api/deleteUser/';
        this.axios.delete(url + userToDelete)
          .then(res => {
            let self = this;
            console.log(res);
            self.callAppropriateGet(1);
            alert('המשתמש נמחק בהצלחה')
          })
          .catch(error => {
            console.log(error);
          });
      },
      callAppropriateGet(option) {
        if (option === 1) {
            this.getAllUsers();
          } else if (option === 2){
            this.getUserWithDebts();
          } else if (option === 3) {
            this.getUserWithoutDebts();
          }
      },
      initUsers (users) {
        this.relevantUsers = users;
        this.users = users;
      },
      showRelevantUsers () {
        this.relevantUsers = [];
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].username.indexOf(this.searchQuery) !== -1) {
            this.relevantUsers.push(this.users[i]);
          }
        }
      },
      nameValidate() {
        this.nameGreenOn = !!this.user.name;
        this.nameErrorMessage = this.nameGreenOn ? '' :
          "נא רשמ/י את שמך";
        return this.nameGreenOn;
      },
      phoneValidate () {
        let regex = /^0[0-9]{1,2}-?[0-9]{7}$/;
        this.phoneGreenOn = regex.exec(this.user.phone);
        if (this.user.phone !== '') {
          this.phoneErrorMessage = this.phoneGreenOn ? '' :
            "מספר הפלאפון/הטלפון לא תקין, הוא צריך להיות להתחיל " +
            "ב-3 ספרות (פלאפון) או ב-2 ספרות (טלפון) ולהסתיים ב-7 ספרות";
        } else {
          this.phoneErrorMessage = '';
        }
        return this.phoneGreenOn;
      },
      addressValidate() {
        this.addressGreenOn = !!this.user.address;
        this.addressErrorMessage = this.addressGreenOn ? '' :
          "נא רשמ/י את הכתובת שלך";
        return this.addressGreenOn;
      },
      debtValidate() {
        this.debtGreenOn = !!this.user.debt;
        this.debtErrorMessage = this.debtGreenOn ? '' :
          "נא רשמ/י את סכום החוב שלך";
        return this.addressGreenOn;
      },

      registerFormValidation () {
        if (this.user.name === '') {
          this.nameErrorMessage = "נא רשמ/י את שמך";
          return false;
        }
        if (this.user.phone === '') {
          this.phoneErrorMessage = "נא רשמ/י פלאפון";
          return false;
        }
        if (this.user.phone !== '' && !this.phoneGreenOn) {
          return false;
        }
        if (this.user.address === '') {
          this.addressErrorMessage = "נא רשמ/י את הכתובת שלך";
          return false;
        }
        this.addUser();
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    box-sizing: border-box;
    margin: 2px;
  }

  h4 {
    font-weight: normal;
    direction: rtl;
    color: green;
  }

  form {
    background-color: white;
    width: 300px;
    display: inline-block;
  }

  ::-webkit-input-placeholder {
    text-align: center;
  }

  :-moz-placeholder { /* Firefox 18- */
    text-align: center;
  }

  ::-moz-placeholder {  /* Firefox 19+ */
    text-align: center;
  }

  :-ms-input-placeholder {
    text-align: center;
  }

  .main_container {
    display: inline-flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 1140px;
  }

  input {
    text-align: right;
  }

  table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
    width: auto;
  }
  table {
    direction: rtl;
    background-color: white;
  }

  caption {
    caption-side: top;
    text-align: center;
    font-weight: bold;
    text-decoration: underline;
    color: blue;
    font-size:20px;
    min-width: 290px;
    background-color:white;
  }

  label {
    display: initial;
  }

  .submitForm{
    color: green;
    font-weight: bold;
  }
</style>

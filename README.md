<h1> REST-MVC-RBAC-JWT prototype </h1>

<p>
  This is a prototype of a NodeJS application using REST API for communication with the services, MVC and OOP architecture of the code, RBAC for determining the roles
  of each user and JWT for authenticating users with tokens. This prototype uses the framework ExpressJS in a decoupled way so that the app wont be so dependant to Express.
</p>

<hr>

<h3> MVC </h3>
<p>
  MVC or Model View Controller is a design pattern that is used for developing apps. It devides the logic of the app in three separate domains 
  that are connected with each other. Those parts are the following:
</p>

<table>
  <tr>
    <td width='75%'>
      <ul>
        <li> 
          <b> View: </b> 
          This part can be any representation of your app. 
          It can be a web page that a user can see of a windowed UI of a desktop app. 
        </li>
        <li> 
          <b> Model: </b> 
          This part is all about the logic of the app. It contains the necessary code to manipulate, fetch and delete data. 
          It is the layer that connects with our database to execute all our processes. 
        </li>
        <li> 
          <b> Controller: </b> 
          This layer is the middle layer between the <b> View </b> and <b> Model </b> layers. 
          It controlls the flow of the code and depending on the action, it calls different <b> Models </b> 
          to achieve the desired output. 
        </li>
      </ul>
    </td>
    <td width='25%'>
      <center>
        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/MVC-Process.svg/200px-MVC-Process.svg.png' />
        <p> source: Wikepedia <a href='https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller#/media/File:MVC-Process.svg'> &#187; </a> </p>
      </center>
    </td>
  </tr>  
</table>

<h3> REST </h3>
<p>
  REST also known as Representational State Transfer is a software architecture for creating web services. By using web services our application can manipulate
  the resources of our app. The REST architecture uses the HTTP protocol to reach those resources with one of the following HTTP methods :
  <ul>
    <li> <b> GET: </b> Used to fetch resources. </li>
    <li> <b> PUT: </b> Used for modifying existing resources by completely overriding them. </li>
    <li> <b> POST: </b> Used to create resources. </li>
    <li> <b> PATCH: </b> Used for modifying partila existing resources. </li>
    <li> <b> DELETE: </b> Used to delete resources. </li>
  </ul>
</p>


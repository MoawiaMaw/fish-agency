<?php 

include("config.php");

$data =json_decode(file_get_contents("php://input"),true);
$name = $data['name'];
// step 1

$resp["status"] = mysqli_query($con, "update users set isLoggedIn='0' where username = '$name' "); // step 2 & 3

echo json_encode($resp); // step 4

?>
<?php 
include("config.php");

$data = json_decode(file_get_contents("php://input"), true);

$boat = $data["boat"];
$type = $data["type"];
$quantity = $data["quantity"];

$resp["status"] = mysqli_query($con, "insert into loads (fishing_boat, fish_type, quantity) values ('$boat', '$type', '$quantity')");

echo json_encode($resp);
?>
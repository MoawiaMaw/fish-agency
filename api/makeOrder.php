<?php 
include("config.php");

$data = json_decode(file_get_contents("php://input"), true);

$agent = $data['agent'];
$fish_type = $data['fish_type'];
$batch = $data['batch'];
$available_quantity = $data['available_quantity'];
$ordered_quantity = $data['ordered_quantity'];
$status = $data['status'];

$resp["status"] = mysqli_query($con, "insert into orders (agent, fish_type, batch_no, available_quantity, ordered_quantity, status) values ('$agent', '$fish_type', '$batch', '$available_quantity', '$ordered_quantity', '$status')");
if($ordered_quantity < $available_quantity){
    $resp["update"] = mysqli_query($con, "update loads set quantity = quantity - '$ordered_quantity' where id = '$batch'");
}

echo json_encode($resp);
?>
<?php
include("config.php");

$resultG = mysqli_query($con, "select * from loads where fishing_boat = 'Goerge boat'");
$resultM = mysqli_query($con, "select * from loads where fishing_boat = 'Maw boat'");
$resultA = mysqli_query($con, "select * from loads where fishing_boat = 'Ahmed boat'");
$data['george'] = mysqli_fetch_all($resultG, MYSQLI_ASSOC);
$data['maw'] = mysqli_fetch_all($resultM, MYSQLI_ASSOC);
$data['ahmed'] = mysqli_fetch_all($resultA, MYSQLI_ASSOC);


echo json_encode($data);
?>
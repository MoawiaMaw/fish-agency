<?php
include("config.php");

$resultG = mysqli_query($con, "select * from loads where fish_type = 'Grouper'");
$resultM = mysqli_query($con, "select * from loads where fish_type = 'Mackerel'");
$resultT = mysqli_query($con, "select * from loads where fish_type = 'Tilapia'");
$data['grouper'] = mysqli_fetch_all($resultG, MYSQLI_ASSOC);
$data['mackerel'] = mysqli_fetch_all($resultM, MYSQLI_ASSOC);
$data['tilapia'] = mysqli_fetch_all($resultT, MYSQLI_ASSOC);


echo json_encode($data);
?>
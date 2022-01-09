<?php
include("config.php");

$result = mysqli_query($con, "select * from orders where status = 'OK'");
$data = mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($data);
?>
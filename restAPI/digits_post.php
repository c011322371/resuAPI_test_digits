<?php
  header("Content-Type: application/json; charset=utf-8");

  $ch = curl_init();
  curl_setopt_array($ch, [
    CURLOPT_URL            => 'http://0.0.0.0:5000/models/images/classification/classify_one.json',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => [
      'job_id'  => $_POST['job_id'],
      'image_file' =>  new CURLFile($_FILES['image_file']['tmp_name']), // 保存されたサーバー上の画像path
    ],
  ]);
  $response = curl_exec($ch);
  echo $response;
  curl_close($ch);
?>

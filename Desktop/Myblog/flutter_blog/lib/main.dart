import 'package:flutter/material.dart';
import 'package:flutter_blog/views/home.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

 
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Blog ',
      theme: ThemeData.dark(), 
      home:HomePage(),
    );
  }
}

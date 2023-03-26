import 'dart:io';
import 'dart:math';

import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_blog/services/crud.dart';
import 'package:image_picker/image_picker.dart';

class CreateBlog extends StatefulWidget {
  const CreateBlog({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _CreateBlogState createState() => _CreateBlogState();
}

class _CreateBlogState extends State<CreateBlog> {
  String? authorName, title, desc;

  File? selectedImage;
  bool _isLoading = false;
  final crudMethods = CrudMethods();

  Future<void> getImage() async {
    final image = await ImagePicker().pickImage(source: ImageSource.gallery);

    setState(() {
      selectedImage = image != null ? File(image.path) : null;
    });
  }

  Future<void> uploadBlog() async {
    if (selectedImage != null) {
      setState(() {
        _isLoading = true;
      });

      final firebaseStorageRef = FirebaseStorage.instance
          .ref()
          .child("blogImages")
          .child("${Random().nextInt(1000000000)}.jpg");

      try {
        final task = await firebaseStorageRef.putFile(selectedImage!);
        final downloadUrl = await task.ref.getDownloadURL();
        // Made some changes here 
        if (kDebugMode) {
          print("this is url $downloadUrl");
        }

        final blogMap = {
          "imgUrl": downloadUrl,
          "authorName": authorName ?? "",
          "title": title ?? "",
          "desc": desc ?? ""
        };
        await crudMethods.addData(blogMap);
        // ignore: use_build_context_synchronously
        Navigator.pop(context);
      } catch (error) {
        // ignore: avoid_print
        print(error);
      } finally {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

 @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const <Widget>[
            Text(
              "Flutter",
              style: TextStyle(fontSize: 22),
            ),
            Text(
              "Blog",
              style: TextStyle(fontSize: 22, color: Colors.blue),
            )
          ],
        ),
        backgroundColor: Colors.transparent,
        elevation: 0.0,
        actions: <Widget>[
          GestureDetector(
            onTap: () {
              uploadBlog();
            },
            child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: const Icon(Icons.file_upload)),
          )
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: <Widget>[
                    const SizedBox(height: 10),
                    GestureDetector(
                      onTap: getImage,
                      child: selectedImage != null
                          ? Container(
                              height: 170,
                              width: MediaQuery.of(context).size.width,
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(6),
                                child: Image.file(
                                  selectedImage!,
                                  fit: BoxFit.cover,
                                ),
                              ),
                            )
                          : Container(
                              height: 170,
                              decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(6)),
                              width: MediaQuery.of(context).size.width,
                              child: const Icon(
                                Icons.add_a_photo,
                                color: Colors.black45,
                              ),
                            )),
                    const SizedBox(
                      height: 8,
                    ),
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 16),
                      child: Column(
                        children: <Widget>[
                          TextField(
                            decoration:
                                const InputDecoration(hintText: "Author Name"),
                            onChanged: (val) {
                              authorName = val;
                            },
                          ),
                          TextField(
                            decoration:
                                const InputDecoration(hintText: "Title"),
                            onChanged: (val) {
                              title = val;
                            },
                          ),
                          TextField(
                            decoration:
                                const InputDecoration(hintText: "Desc"),
                            onChanged: (val) {
                              desc = val;
                            },
                          )
                        ],
                      ),
                    )
                  ],
                ),
              ),
            ),
    );
  }
  }
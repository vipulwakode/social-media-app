const Post=require("../models/Post");
exports.viewCreateScreen=function(req,res){
    res.render("create-post");
}
exports.create=async function(req,res){
let post=new Post(req.body,req.session.user._id);
 try{
  const newId = await post.create();
  req.flash("success","New post successfully created.");
  req.session.save(()=>res.redirect(`/post/${newId}`));
 }catch(errors){
     errors.forEach(error => req.flash("errors",error));
     req.session.save(() => res.redirect("/create-post"))
 }
}

exports.apiCreate=async function(req,res){
let post=new Post(req.body,req.apiUser._id);
try{
  const newId = await post.create();
   res.json("Congrats");
  }catch(errors){
  res.json(errors);
 }
}

exports.viewSingle= async function(req,res){
 try{
  let post=await Post.findSingleById(req.params.id,req.visitorId);
  res.render("single-post-screen",{post:post,title:post.title});
 }catch{
    res.render("404");
 }
}
exports.viewEditScreen=async function(req,res){
  try{
    let post=await Post.findSingleById(req.params.id,req.visitorId);
    if(post.isVisitorOwner){
      res.render("edit-post",{post:post});
    }else{
      req.flash("errors","You do not have permission to perform that action.");
      req.session.save(() => res.redirect("/"));
    }
  }catch{
     res.render("404");
  }
}
exports.edit=async function(req,res){
let post=new Post(req.body,req.visitorId,req.params.id);
try{
  const status = await post.update();
  //the post was successfully updated in the database
  //Or user did have permission ,but there were validation errors
  if(status == "success"){
   //post was updated in db
   req.flash("success","Post successfully updated.")
   req.session.save(() => res.redirect(`/post/${req.params.id}/edit`));
  } else{
    post.errors.forEach(function(error){
      req.flash("errors",error);
    })
    req.session.save(() =>  res.redirect(`/post/${req.params.id}/edit`));
  }
}catch{
   //a post with the requested id doesn't exist
  //or if the current visitor is not the Owner of the post
  req.flash("errors","You do not have permission to perform that action");
  req.session.save(() => res.redirect("/"));
 }
}

exports.delete=async function(req,res){
  try{
    await Post.delete(req.params.id,req.visitorId);
     req.flash("success","Post successfully deleted.");
     req.session.save(() => res.redirect(`/profile/${req.session.user.username}`));
  }catch{
      req.flash("errors","You do not have permission to perform that actions.");
      req.session.save(() => res.redirect("/"));
  }
}

exports.apiDelete=async function(req,res){
 try{
    await Post.delete(req.params.id,req.apiUser._id);
     res.json("Post successfully deleted.");
 }catch{
     res.json("You do not have permission to perform that action.");
 }
}

exports.search=async function(req,res){
  try{
  const posts = await Post.search(req.body.searchTerm);
   res.json(posts);
  }catch{
    res.json([]);
  }
}
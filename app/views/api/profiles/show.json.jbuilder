json.id @profile.id
json.display_name @profile.display_name

json.picture_url @profile.picture_url

json.full_name @profile.full_name
json.location @profile.location
json.description @profile.description

json.submissions @profile.user.submissions do |submission|
  json.id submission.id
  json.title submission.title
  json.description submission.description
  
  json.remote_url submission.remote_url
  json.image_url submission.image_url
end
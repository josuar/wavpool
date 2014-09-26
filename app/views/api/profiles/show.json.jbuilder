json.id @profile.id

if @profile.user == current_user
  json.user_id current_user.id
end

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
  
  json.timestamp time_ago_in_words(submission.created_at)
  json.created_at submission.created_at
  
  json.profile do
    json.id @profile.id
    json.name @profile.display_name
  end
end
json.id @profile.id
json.user_id @profile.user.id

json.following_count @profile.user.followees.size
json.followed_count @profile.user.followers.size

json.submission_count @profile.user.submissions.count

unless @profile == current_user.profile
  json.followed current_user.follows?(@profile.user)
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

  if signed_in?
    json.liked current_user.likes?(submission)
  end
  
  json.likes submission.likes.count
  
  json.remote_url submission.remote_url
  json.image_url submission.image_url
  
  json.timestamp time_ago_in_words(submission.created_at)
  json.created_at submission.created_at
  
  json.profile do
    json.id @profile.id
    json.name @profile.display_name
  end
end
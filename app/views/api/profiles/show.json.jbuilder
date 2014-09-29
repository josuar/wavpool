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
  json.partial! 'api/submissions/submission', submission: submission
end
# Base attributes
json.(@profile, :id, :display_name, :full_name, :location,
  :description, :picture_url)
  
# Followings
json.following_count @profile.user.followees.size
json.followed_count @profile.user.followers.size

if current_user && @profile != current_user.profile
  json.followed current_user.follows?(@profile.user)
end

# Submissions
json.submission_count @profile.user.submissions.size

json.submissions @profile.user.submissions do |submission|
  json.partial! 'api/submissions/submission', submission: submission
end
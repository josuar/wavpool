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

json.submissions @profile.user.submissions.limit(10) do |submission|
  json.partial! 'api/submissions/submission', submission: submission
end

# Recent likes
json.recent_likes @profile.user.recent_likes do |submission|
  json.(submission, :id, :title, :image_url)
  
  json.likes submission.likes.size
  
  json.submitter do
    json.id submission.submitter.id
    json.display_name submission.submitter.display_name
  end
end

# Recent comments
json.recent_comments @profile.user.recent_comments do |comment|
  json.(comment, :content)
  
  json.submission do
    json.id comment.submission.id
    json.title comment.submission.title
  end
end
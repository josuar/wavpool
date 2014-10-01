# Base attributes
json.(submission, :id, :title, :description, :remote_url, :image_url)

json.submitted time_ago_in_words(submission.created_at)

# Likes
json.likes submission.likes.size

if signed_in?
  json.liked current_user.likes?(submission)
end

# Profile
json.submitter do
  json.id submission.submitter.id
  json.display_name submission.submitter.display_name
  json.picture_url submission.submitter.picture_url
  
  json.followed_count submission.submitter.user.followers.size
  json.submission_count submission.submitter.user.submissions.size
end

# Comments
json.comments submission.comments do |comment|
  json.partial! 'api/comments/comment', comment: comment
end
# Base attributes
json.(submission, :id, :title, :description, :remote_url, :image_url)

json.submitted time_ago_in_words(submission.created_at)

# Likes
json.likes submission.likes.size

if signed_in?
  json.liked current_user.likes?(submission)
end

# Profile
json.submitter submission.submitter, :id, :display_name, :picture_url

# Comments
json.comments submission.comments do |comment|
  json.partial! 'api/comments/comment', comment: comment
end
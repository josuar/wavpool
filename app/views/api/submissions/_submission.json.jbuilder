json.id submission.id
json.title submission.title
json.description submission.description

if signed_in?
  json.liked current_user.likes?(submission)
end

json.likes submission.likes.size

json.comments submission.comments do |comment|
  json.partial! 'api/comments/comment', comment: comment
end

json.remote_url submission.remote_url
json.image_url submission.image_url

json.timestamp time_ago_in_words(submission.created_at)
json.created_at submission.created_at

json.profile do
  json.id submission.user.profile.id
  json.name submission.user.profile.display_name
end
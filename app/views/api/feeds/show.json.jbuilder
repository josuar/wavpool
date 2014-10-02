json.submissions @feed do |submission|
  json.partial! 'api/submissions/submission', submission: submission
end

json.recommended_users current_user.recommended_users do |user|
  json.id user.id
  json.display_name user.display_name
  json.picture_url user.picture_url

  json.followed_count user.user.followers.size
  json.submission_count user.user.submissions.size
end

# Recent likes
json.recent_likes @current_user.recent_likes do |submission|
  json.(submission, :id, :title, :image_url)
  
  json.likes submission.likes.size
  
  json.submitter do
    json.id submission.submitter.id
    json.display_name submission.submitter.display_name
  end
end
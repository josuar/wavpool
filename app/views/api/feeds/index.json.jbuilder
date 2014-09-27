json.submissions @feed do |submission|
  json.id submission.id
  json.title submission.title
  json.description submission.description
  
  json.remote_url submission.remote_url
  json.image_url submission.image_url
  
  json.timestamp time_ago_in_words(submission.created_at)
  json.created_at submission.created_at
  
  json.profile do
    json.id submission.user.profile.id
    json.name submission.user.profile.display_name
  end
end
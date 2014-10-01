json.(comment, :content, :track_timestamp)

json.profile do
  json.id comment.user.profile.id
  json.display_name comment.user.profile.display_name
  json.picture_url comment.user.profile.picture_url
end
json.profile do
  json.id comment.user.profile.id
  json.name comment.user.profile.display_name
  json.picture_url comment.user.profile.picture_url
end

json.timestamp comment.track_timestamp

json.content comment.content
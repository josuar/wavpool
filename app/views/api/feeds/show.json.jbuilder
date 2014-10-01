json.submissions @feed do |submission|
  json.partial! 'api/submissions/submission', submission: submission
end
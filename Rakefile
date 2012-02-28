task :default => [:hamls, :sasses, :scsses, :coffees, :javascripts]

HAMLS = FileList['priv/source/html/*.haml']
CONVERTED_HAMLS = HAMLS.map{ |h| h.sub(%r{source/html}, 'admin').sub(%r{\.haml$}, '')}

SASSES = FileList['priv/source/css/*.sass']
CONVERTED_SASSES = SASSES.map{ |h| h.sub(%r{source/css}, 'admin/css').sub(%r{\.sass$}, '')}
SCSSES = FileList['priv/source/css/*.scss']
CONVERTED_SCSSES = SCSSES.map{ |h| h.sub(%r{source/css}, 'admin/css').sub(%r{\.scss$}, '')}

COFFEES = FileList['priv/source/js/*.coffee']
CONVERTED_COFFEES = COFFEES.map{ |h| h.sub(%r{source/js}, 'admin/js').sub(%r{\.coffee$}, '.js')}
JAVASCRIPTS = FileList['priv/source/js/*.js']
CONVERTED_JAVASCRIPTS = JAVASCRIPTS.map{ |h| h.sub(%r{source/js}, 'admin/js')}

task :hamls => CONVERTED_HAMLS

CONVERTED_HAMLS.zip(HAMLS) do |r|
  target = r.first
  source = r.last
  desc "#{source} => #{target}"
  file target => source do
    sh 'haml', source, target
  end
end

task :sasses => CONVERTED_SASSES

CONVERTED_SASSES.zip(SASSES) do |r|
  target = r.first
  source = r.last
  desc "#{source} => #{target}"
  file target => source do
    sh 'sass', source, target
  end
end

task :scsses => CONVERTED_SCSSES

CONVERTED_SCSSES.zip(SCSSES) do |r|
  target = r.first
  source = r.last
  desc "#{source} => #{target}"
  file target => source do
    sh 'scss', source, target
  end
end

task :coffees => CONVERTED_COFFEES

CONVERTED_COFFEES.zip(COFFEES) do |r|
  target = r.first
  source = r.last
  target_dir = 'priv/admin/js'
  desc "#{source} => #{target}"
  file target => source do
    sh 'coffee', '-co', target_dir, source
  end
end

task :javascripts => CONVERTED_JAVASCRIPTS

CONVERTED_JAVASCRIPTS.zip(JAVASCRIPTS) do |r|
  target = r.first
  source = r.last
  desc "#{source} => #{target}"
  file target => source do
    FileUtils.cp source, target
  end
end

node('node-patsav-dev') {
    stage('Checkout') {
        echo 'configure started'
        git branch: 'dev', credentialsId:'1ec53419-3239-427e-a64a-d77a95d56682', url: 'https://gitlab.com/wavelab-domains/user.git'
        echo 'configure done'
    }
    stage('Build') {
         if (isUnix()) {
            /*sh 'sudo -S true'*/
            sh 'sudo docker-compose build'
        } else {
            bat 'sudo docker-compose build'
        }
    }
    stage('Code Quality') {
    if (isUnix()) {
                            sh 'sudo docker-compose run --rm user  yarn run code_quality'
                        } else {
                            bat 'sudo docker-compose run --rm user  yarn run code_quality'
                        }
                        publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './reports/plato', reportFiles: 'index.html', reportName: 'Code Quality', reportTitles: 'Code Quality'])
                        echo 'Code Quality ended'
    }

    stage('Code Coverage') {

    }
    stage('Deployment'){

    }

}